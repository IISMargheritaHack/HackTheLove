import psycopg2
from faker import Faker
import random
import uuid
import re

fake = Faker()

DB_CONFIG = {
    "dbname": "postgres",
    "user": "username",
    "password": "password",
    "host": "localhost",
    "port": "5432",
}

def connect_db():
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        return conn
    except Exception as e:
        print(f"❌ Database connection error: {e}")
        return None

# ✅ Clean phone number
def generate_clean_phone():
    phone = fake.unique.phone_number()
    phone = re.sub(r'\D', '', phone)  # Remove all non-digit characters
    return phone[:15]  # Ensure it's within 15 digits

def generate_fake_user():
    return {
        "email": fake.unique.email()[:255],
        "name": fake.first_name()[:255],
        "surname": fake.last_name()[:255],
        "phone": generate_clean_phone(),  # Use cleaned phone
        "sex": random.choice([True, False]),
        "bio": fake.text(max_nb_chars=200),
        "age": random.randint(10, 100),  # Expanded range
        "section": random.choice(["A", "B", "C", "D", "E"]),
        "classe": random.randint(1, 5)   # Ensure integer type
    }

def generate_survey_response():
    return ''.join(random.choices(["a", "b", "c", "d"], k=11))

def add_users_with_surveys(n):
    conn = connect_db()
    if conn is None:
        print("❌ Unable to connect to the database.")
        return

    cursor = conn.cursor()

    user_insert_query = """
        INSERT INTO users (email, name, surname, phone, sex, bio, age, section, id_survey, classe)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        ON CONFLICT (email) DO NOTHING;
    """

    survey_insert_query = """
        INSERT INTO surveys (id_survey, response)
        VALUES (%s, %s)
        RETURNING id_survey;
    """

    users = []
    for _ in range(n):
        user = generate_fake_user()
        survey_id = str(uuid.uuid4())
        response = generate_survey_response()

        try:
            cursor.execute(survey_insert_query, (survey_id, response))
            inserted_survey_id = cursor.fetchone()[0]

            users.append((
                user["email"], user["name"], user["surname"], user["phone"],
                user["sex"], user["bio"], user["age"], user["section"], inserted_survey_id,
                user["classe"]
            ))
        except Exception as e:
            print(f"⚠️ Error inserting survey: {e}")
            conn.rollback()

    try:
        cursor.executemany(user_insert_query, users)
        conn.commit()
        print(f"✅ Inserted {cursor.rowcount} users and surveys into the database!")
    except Exception as e:
        print(f"❌ Error inserting users: {e}")
        conn.rollback()
    finally:
        cursor.close()
        conn.close()

def main():
    num_users = int(input("How many users do you want to generate? "))
    add_users_with_surveys(num_users)

if __name__ == "__main__":
    main()
