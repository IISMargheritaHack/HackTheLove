from locust import HttpUser, task, between,TaskSet

SECRET_KEY = "2216fdb7ef29b44eea9471792a26ea2ae5455c2d81eccac4c172a4cb86c97042b2e80edb01af324e39b5b82c9734f161f73e04f55d278a148b3792057a468dca"
BACKEND_URL = "http://localhost:8080"

class FrontendTasks(TaskSet):
    @task(1)
    def view_homepage(self):
        self.client.get("/")

    @task(2)
    def view_questionnaire(self):
        self.client.get("/bio")

    @task(3)
    def fill_questionnaire(self):
        self.client.get("/survey")

    @task(4)
    def view_profiles(self):
        self.client.get("/profile")

    @task(5)
    def like_dislike(self):
        self.client.get("/likes")

class BackendTasks(TaskSet):
    @task(7)
    def check_backend_status(self):
        self.client.get("/")

    @task(8)
    def check_health(self):
        self.client.get("/health")

    @task(9)
    def fetch_questions(self):
        self.client.get("/questions")

    @task(10)
    def fetch_server_time(self):
        self.client.get("/time")

    @task(11)
    def get_user(self):
        self.client.get("/getUser")

    @task(12)
    def get_user_by_params(self):
        self.client.get("/getUserByParams")

    @task(13)
    def get_survey(self):
        self.client.get("/getSurvey")

    @task(14)
    def get_photo(self):
        self.client.get("/getPhoto")

    @task(15)
    def get_photo_by_params(self):
        self.client.get("/getPhotoByParams")

    @task(16)
    def get_matches(self):
        self.client.get("/getMatches")

    @task(17)
    def get_likes_matches(self):
        self.client.get("/getLikesMatches")

class HackTheLoveUser(HttpUser):
    wait_time = between(1, 5)
    tasks = {FrontendTasks: 1, BackendTasks: 1}

    def on_start(self):
        self.token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImZyYW5jZXNjby5tZW1vbGlAaWlzbWFyZ2hlcml0YWhhY2tiYXJvbmlzc2kuZWR1Lml0IiwiZXhwIjoxNzM5NjUwNjYzLCJmYW1pbHlfbmFtZSI6Ik1FTU9MSSIsImdpdmVuX25hbWUiOiJGUkFOQ0VTQ08ifQ.AujOAgNim0FcUAGQbuJJSIxCnXAFZeSCGJ7LPiqTRR4"
        self.client.headers = {"Authorization": f"{self.token}"}

    # **POST REQUESTS (SENZA TASK)**
    def add_survey(self):
        self.client.post("/addSurvey", json={"data": "survey_data"})

    def add_photo(self):
        self.client.post("/addPhoto", json={"data": "photo_data"})

    def add_user_info(self):
        self.client.post("/addUserInfo", json={"data": "user_info"})

    def set_like(self):
        self.client.post("/setLike", json={"data": "like_data"})
