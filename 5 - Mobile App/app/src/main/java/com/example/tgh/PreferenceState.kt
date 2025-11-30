package com.example.tgh

data class PreferenceState(
    val preferences: List<Preference> = emptyList(),
    val name: String = "",
    val isLiked: Boolean = false,
    val isAllergy: Boolean = false,
    val isAddingPreference: Boolean = false,
    var personId: Int = 1,

)
