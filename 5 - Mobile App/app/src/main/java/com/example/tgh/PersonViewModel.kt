package com.example.tgh

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.flatMapLatest
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch

class PersonViewModel(
    private val dao: PersonDao
): ViewModel() {

    private val _sortType = MutableStateFlow(SortType.FIRST_NAME)
    @OptIn(ExperimentalCoroutinesApi::class)
    private val _people = _sortType
        .flatMapLatest { sortType ->
            when(sortType) {
                SortType.FIRST_NAME -> dao.getPersonListByFirstName()
                SortType.LAST_NAME -> dao.getPersonListByLastName()
            }
    }
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(), emptyList())
    private val _state = MutableStateFlow(PersonState())
    val state = combine(_state, _sortType, _people) {state, sortType, people ->
        state.copy(
            people = people,
            sortType = sortType,

        )
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), PersonState())

    fun onEvent(event: PersonEvent){
        when(event){
            is PersonEvent.DeletePerson -> {
                viewModelScope.launch {
                dao.deletePerson(event.person)
                }
            }
            PersonEvent.HideDialog -> {
                _state.update { it.copy(
                    isAddingPerson = false
                )}
            }
            PersonEvent.SavePerson -> {
                val firstName = state.value.firstName
                val lastName = state.value.lastName

                if (firstName.isBlank() || lastName.isBlank()){
                    return
                }

                val person = Person(
                    firstName = firstName,
                    lastName = lastName
                )

                viewModelScope.launch {
                    dao.insertPerson(person)
                }

                _state.update { it.copy(
                    isAddingPerson = false,
                    firstName = "",
                    lastName = "",
                )}
            }
            is PersonEvent.SetFirstName -> {
                _state.update {
                    it.copy(firstName = event.firstName)
                }
            }
            is PersonEvent.SetLastName -> {
                _state.update {
                    it.copy(lastName = event.lastName)
                }
            }
            PersonEvent.ShowDialog -> {
                _state.update {
                    it.copy(
                        isAddingPerson = true
                    )
                }
            }
            is PersonEvent.SortPeople -> {
                _sortType.value = event.sortType
            }
        }
    }

}