import psycopg2
from faker import Faker
import random
import uuid
import re
import io
import os

fake = Faker()

DB_CONFIG = {
    "dbname": "postgres",
    "user": "username",
    "password": "password",
    "host": "localhost",
    "port": "5432",
}

def get_possible_images():
    image_folder = "./images"
    return [f for f in os.listdir(image_folder) if f.lower().endswith(('.jpeg', '.jpg', '.png', '.gif'))]

possible_images = get_possible_images()

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
        "phone": generate_clean_phone(),
        "sex": random.choice([True, False]),
        "bio": fake.text(max_nb_chars=200),
        "age": random.randint(10, 100),
        "section": random.choice(["A", "B", "C", "D", "E"]),
        "classe": random.randint(1, 5)
    }

def generate_survey_response():
    return ''.join(random.choices(["a", "b", "c", "d"], k=11))

# ✅ Caricamento dinamico delle immagini
def fetch_random_image():
    try:
        if not possible_images:
            print("⚠️ No images found in the 'images' folder.")
            return None

        image_filename = random.choice(possible_images)
        with open(f"./images/{image_filename}", 'rb') as img_file:
            return io.BytesIO(img_file.read())
    except Exception as e:
        print(f"⚠️ Error loading image: {e}")
        return None

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

    image_insert_query = """
        INSERT INTO images (email_user, lo_oid, metadata)
        VALUES (%s, %s, %s);
    """

    for _ in range(n):
        user = generate_fake_user()
        survey_id = str(uuid.uuid4())
        response = generate_survey_response()

        try:
            # Inserisci survey e ottieni l'ID
            cursor.execute(survey_insert_query, (survey_id, response))
            inserted_survey_id = cursor.fetchone()[0]

            # Inserisci utente
            cursor.execute(user_insert_query, (
                user["email"], user["name"], user["surname"], user["phone"],
                user["sex"], user["bio"], user["age"], user["section"],
                inserted_survey_id, user["classe"]
            ))

            # Inserisci immagine
            img_data = fetch_random_image()
            if img_data:
                lobj = conn.lobject(0, 'w', 0)
                lobj.write(img_data.read())
                lobj.close()

                cursor.execute(image_insert_query, (user["email"], lobj.oid, '{"description": "Random stock image"}'))

            conn.commit()  # ✅ Commit per ogni utente

        except Exception as e:
            print(f"⚠️ Error inserting data: {e}")
            conn.rollback()

    cursor.close()
    conn.close()
    print(f"✅ Inserted {n} users, surveys, and images into the database!")

def main():
    try:
        num_users = int(input("How many users do you want to generate? "))
        add_users_with_surveys(num_users)
    except ValueError:
        print("❌ Invalid input. Please enter a valid number.")

if __name__ == "__main__":
    main()
