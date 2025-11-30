package com.example.tgh

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity
data class Preference(
    val name: String,
    val isLiked: Boolean,
    val isAllergy: Boolean,
    val personId: Int,

    @PrimaryKey(autoGenerate = true)
    val id: Int = 0,
)
