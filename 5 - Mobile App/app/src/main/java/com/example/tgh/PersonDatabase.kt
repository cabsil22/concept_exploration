package com.example.tgh

import androidx.room.Database
import androidx.room.RoomDatabase

@Database(
    entities = [Person::class, Preference::class],
    version = 2
)
abstract class PersonDatabase: RoomDatabase() {

    abstract val dao: PersonDao
}