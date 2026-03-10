import requests
import sys
import json
from datetime import datetime

class BackendTester:
    def __init__(self):
        self.base_url = "https://blockquest-miners.preview.emergentagent.com/api"
        self.tests_run = 0
        self.tests_passed = 0
        self.player_id = None

    def run_test(self, name, method, endpoint, expected_status, data=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers)

            print(f"   Status: {response.status_code}")
            
            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed")
                try:
                    response_data = response.json()
                    print(f"   Response: {json.dumps(response_data, indent=2)[:200]}...")
                    return True, response_data
                except:
                    return True, {}
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                try:
                    error_data = response.json()
                    print(f"   Error: {error_data}")
                except:
                    print(f"   Error: {response.text}")
                return False, {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_api_root(self):
        """Test API root endpoint"""
        return self.run_test("API Root", "GET", "", 200)

    def test_create_progress(self):
        """Test creating new game progress"""
        data = {
            "xp": 0,
            "currentLevel": 1,
            "completedLevels": [],
            "badges": []
        }
        success, response = self.run_test("Create Progress", "POST", "progress", 200, data)
        if success and 'id' in response:
            self.player_id = response['id']
            print(f"   Created player ID: {self.player_id}")
        return success

    def test_get_progress(self):
        """Test getting game progress by player ID"""
        if not self.player_id:
            print("⚠️ Skipping get progress test - no player ID")
            return False
        return self.run_test("Get Progress", "GET", f"progress/{self.player_id}", 200)[0]

    def test_update_progress(self):
        """Test updating game progress"""
        if not self.player_id:
            print("⚠️ Skipping update progress test - no player ID")
            return False
        
        data = {
            "xp": 50,
            "currentLevel": 2,
            "completedLevels": [1],
            "badges": [{"id": "chain_starter", "name": "Chain Starter", "icon": "🔗"}]
        }
        return self.run_test("Update Progress", "PUT", f"progress/{self.player_id}", 200, data)[0]

    def test_get_updated_progress(self):
        """Test getting updated progress"""
        if not self.player_id:
            print("⚠️ Skipping get updated progress test - no player ID")
            return False
        return self.run_test("Get Updated Progress", "GET", f"progress/{self.player_id}", 200)[0]

    def test_leaderboard(self):
        """Test leaderboard endpoint"""
        return self.run_test("Get Leaderboard", "GET", "leaderboard", 200)[0]

    def test_delete_progress(self):
        """Test deleting game progress"""
        if not self.player_id:
            print("⚠️ Skipping delete progress test - no player ID")
            return False
        return self.run_test("Delete Progress", "DELETE", f"progress/{self.player_id}", 200)[0]

    def test_get_deleted_progress(self):
        """Test getting deleted progress should return 404"""
        if not self.player_id:
            print("⚠️ Skipping get deleted progress test - no player ID")
            return False
        return self.run_test("Get Deleted Progress", "GET", f"progress/{self.player_id}", 404)[0]

def main():
    print("🎮 Testing BlockQuest Miners Backend API")
    print("="*50)
    
    tester = BackendTester()
    
    # Run tests in order
    tests = [
        tester.test_api_root,
        tester.test_create_progress,
        tester.test_get_progress,
        tester.test_update_progress,
        tester.test_get_updated_progress,
        tester.test_leaderboard,
        tester.test_delete_progress,
        tester.test_get_deleted_progress,
    ]
    
    for test in tests:
        try:
            test()
        except Exception as e:
            print(f"❌ Test failed with exception: {e}")
    
    # Print results
    print("\n" + "="*50)
    print(f"📊 Tests Results: {tester.tests_passed}/{tester.tests_run}")
    success_rate = (tester.tests_passed / tester.tests_run * 100) if tester.tests_run > 0 else 0
    print(f"📈 Success Rate: {success_rate:.1f}%")
    
    if tester.tests_passed == tester.tests_run:
        print("🎉 All backend tests passed!")
        return 0
    else:
        print("⚠️ Some backend tests failed.")
        return 1

if __name__ == "__main__":
    sys.exit(main())