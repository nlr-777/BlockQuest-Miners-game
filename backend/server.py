from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime, timezone

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app
app = FastAPI(title="BlockQuest Miners API")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Define Models
class Badge(BaseModel):
    id: str
    name: str
    icon: str

class GameProgress(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    xp: int = 0
    currentLevel: int = 1
    completedLevels: List[int] = []
    badges: List[Badge] = []
    playerId: Optional[str] = None
    createdAt: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updatedAt: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class GameProgressCreate(BaseModel):
    xp: int = 0
    currentLevel: int = 1
    completedLevels: List[int] = []
    badges: List[Badge] = []
    playerId: Optional[str] = None

class GameProgressUpdate(BaseModel):
    xp: Optional[int] = None
    currentLevel: Optional[int] = None
    completedLevels: Optional[List[int]] = None
    badges: Optional[List[Badge]] = None

# Routes
@api_router.get("/")
async def root():
    return {"message": "BlockQuest Miners API", "version": "1.0.0"}

@api_router.post("/progress", response_model=GameProgress)
async def create_progress(input_data: GameProgressCreate):
    """Create new game progress"""
    progress = GameProgress(
        xp=input_data.xp,
        currentLevel=input_data.currentLevel,
        completedLevels=input_data.completedLevels,
        badges=input_data.badges,
        playerId=input_data.playerId
    )
    
    doc = progress.model_dump()
    doc['createdAt'] = doc['createdAt'].isoformat()
    doc['updatedAt'] = doc['updatedAt'].isoformat()
    
    await db.game_progress.insert_one(doc)
    return progress

@api_router.get("/progress/{player_id}", response_model=GameProgress)
async def get_progress(player_id: str):
    """Get game progress by player ID"""
    progress = await db.game_progress.find_one(
        {"id": player_id},
        {"_id": 0}
    )
    
    if not progress:
        raise HTTPException(status_code=404, detail="Progress not found")
    
    # Convert ISO strings back to datetime
    if isinstance(progress.get('createdAt'), str):
        progress['createdAt'] = datetime.fromisoformat(progress['createdAt'])
    if isinstance(progress.get('updatedAt'), str):
        progress['updatedAt'] = datetime.fromisoformat(progress['updatedAt'])
    
    return progress

@api_router.put("/progress/{player_id}", response_model=GameProgress)
async def update_progress(player_id: str, update_data: GameProgressUpdate):
    """Update game progress"""
    existing = await db.game_progress.find_one({"id": player_id}, {"_id": 0})
    
    if not existing:
        raise HTTPException(status_code=404, detail="Progress not found")
    
    update_dict = {k: v for k, v in update_data.model_dump().items() if v is not None}
    update_dict['updatedAt'] = datetime.now(timezone.utc).isoformat()
    
    await db.game_progress.update_one(
        {"id": player_id},
        {"$set": update_dict}
    )
    
    updated = await db.game_progress.find_one({"id": player_id}, {"_id": 0})
    
    if isinstance(updated.get('createdAt'), str):
        updated['createdAt'] = datetime.fromisoformat(updated['createdAt'])
    if isinstance(updated.get('updatedAt'), str):
        updated['updatedAt'] = datetime.fromisoformat(updated['updatedAt'])
    
    return updated

@api_router.delete("/progress/{player_id}")
async def delete_progress(player_id: str):
    """Delete game progress"""
    result = await db.game_progress.delete_one({"id": player_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Progress not found")
    
    return {"message": "Progress deleted successfully"}

@api_router.get("/leaderboard")
async def get_leaderboard(limit: int = 10):
    """Get top players by XP"""
    players = await db.game_progress.find(
        {},
        {"_id": 0, "id": 1, "xp": 1, "completedLevels": 1, "badges": 1}
    ).sort("xp", -1).limit(limit).to_list(limit)
    
    return players

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
