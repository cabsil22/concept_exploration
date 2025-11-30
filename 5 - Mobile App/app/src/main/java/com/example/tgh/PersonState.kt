package com.example.tgh

data class PersonState(
    val people: List<Person> = emptyList(),
    val firstName: String = "",
    val lastName: String = "",
    val isAddingPerson: Boolean = false,
    val sortType: SortType = SortType.FIRST_NAME
)
