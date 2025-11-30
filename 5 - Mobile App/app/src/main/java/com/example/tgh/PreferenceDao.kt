package com.example.tgh

import androidx.room.Dao
import androidx.room.Delete
import androidx.room.Query
import androidx.room.Upsert
import kotlinx.coroutines.flow.Flow

@Dao
interface PreferenceDao {

    @Upsert
    suspend fun insertPreference(preference: Preference)

    @Delete
    suspend fun deletePreference(preference: Preference)

    @Query("SELECT * FROM Preference WHERE personId = :personId ")
    fun getPreferenceListByPersonId(personId:Int): Flow<List<Preference>>

}