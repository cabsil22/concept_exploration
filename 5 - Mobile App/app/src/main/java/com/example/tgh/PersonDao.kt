package com.example.tgh

import androidx.room.Dao
import androidx.room.Delete
import androidx.room.Query
import androidx.room.Upsert
import kotlinx.coroutines.flow.Flow

@Dao
interface PersonDao {

    @Upsert
    suspend fun insertPerson(person: Person)

    @Delete
    suspend fun deletePerson(person: Person)

    @Query("SELECT * FROM Person ORDER BY firstName ASC, lastName ASC")
    fun getPersonListByFirstName(): Flow<List<Person>>

    @Query("SELECT * FROM Person ORDER BY lastName ASC, firstName ASC")
    fun getPersonListByLastName(): Flow<List<Person>>

    @Upsert
    suspend fun insertPreference(preference: Preference)

    @Delete
    suspend fun deletePreference(preference: Preference)

    @Query("SELECT * FROM Preference WHERE personId = :personId ORDER BY name ASC ")
    fun getPreferenceListByPersonId(personId:Int): Flow<List<Preference>>
}