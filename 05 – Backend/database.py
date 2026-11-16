import sqlite3
from pathlib import Path

DB_PATH = Path(__file__).resolve().parent / "astra_care.db"


def get_connection():
    connection = sqlite3.connect(DB_PATH)
    connection.row_factory = sqlite3.Row
    connection.execute("PRAGMA foreign_keys = ON")
    return connection


def init_db():
    with get_connection() as conn:
        conn.executescript("""
        CREATE TABLE IF NOT EXISTS astronauts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            astronaut_code TEXT UNIQUE NOT NULL,
            full_name TEXT,
            mission TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS health_records (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            astronaut_id INTEGER,
            heart_rate REAL,
            spo2 REAL,
            body_temperature REAL,
            recorded_at TEXT DEFAULT CURRENT_TIMESTAMP,
            source TEXT DEFAULT 'manual',
            notes TEXT,
            FOREIGN KEY (astronaut_id) REFERENCES astronauts(id)
        );

        CREATE TABLE IF NOT EXISTS biomarkers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            astronaut_id INTEGER,
            analyte TEXT NOT NULL,
            concentration REAL,
            unit TEXT,
            timepoint TEXT,
            source_dataset TEXT,
            recorded_at TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (astronaut_id) REFERENCES astronauts(id)
        );

        CREATE TABLE IF NOT EXISTS alerts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            astronaut_id INTEGER,
            severity TEXT DEFAULT 'info',
            title TEXT NOT NULL,
            message TEXT,
            status TEXT DEFAULT 'open',
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            resolved_at TEXT,
            FOREIGN KEY (astronaut_id) REFERENCES astronauts(id)
        );

        CREATE TABLE IF NOT EXISTS analysis_results (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            astronaut_id INTEGER,
            model_name TEXT,
            result_type TEXT,
            score REAL,
            prediction TEXT,
            input_reference TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (astronaut_id) REFERENCES astronauts(id)
        );
        """)

    return DB_PATH
