package com.example.tgh

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity
data class Person(
    val firstName: String,
    val lastName: String,

    @PrimaryKey(autoGenerate = true)
    val id: Int = 0,
)
