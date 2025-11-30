package com.example.tgh

sealed interface PersonEvent {
    object SavePerson: PersonEvent
    data class SetFirstName(val firstName:String): PersonEvent
    data class SetLastName(val lastName:String): PersonEvent
    object ShowDialog: PersonEvent
    object HideDialog: PersonEvent
    data class SortPeople(val sortType: SortType): PersonEvent
    data class DeletePerson(val person: Person): PersonEvent

}