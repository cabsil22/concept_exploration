package com.example.tgh

import android.util.Log
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

class PreferenceViewModel(
    private val dao: PersonDao
): ViewModel() {



    private val _personId = MutableStateFlow(1)

    @OptIn(ExperimentalCoroutinesApi::class)
    private val _preferences = _personId.flatMapLatest { newValue ->
        dao.getPreferenceListByPersonId(newValue)
    }
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(), emptyList())
    private val _state = MutableStateFlow(PreferenceState())
    val state = combine(_state, _personId, _preferences) {state, personId, preferences ->
        state.copy(
            preferences = preferences,
            personId = personId,

            )
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), PreferenceState())




    fun onEvent(event: PreferenceEvent){
        when(event){
            is PreferenceEvent.DeletePreference -> {
                viewModelScope.launch {
                    dao.deletePreference(event.preference)
                }
            }
            PreferenceEvent.HideDialog -> {
                _state.update { it.copy(
                    isAddingPreference = false
                )}
            }


            PreferenceEvent.SavePreference -> {
                val name = state.value.name
                val isLiked = state.value.isLiked
                val isAllergy = state.value.isAllergy

                if (name.isBlank()){
                    return
                }

                val preference = Preference(
                    name = name,
                    isLiked = isLiked,
                    isAllergy = isAllergy,
                    personId = state.value.personId
                )

                viewModelScope.launch {
                    dao.insertPreference(preference)
                }

                _state.update { it.copy(
                    isAddingPreference = false,
                    name = "",
                    isAllergy = false,
                    isLiked = false
                )}
            }
            is PreferenceEvent.SetIsLiked -> {
                _state.update {
                    it.copy(isLiked = event.isLiked)
                }
            }
            is  PreferenceEvent.SetPersonId -> {
                _personId.value = event.personId
                Log.i("Test", "Here ${_personId.value}")
            }
            is PreferenceEvent.SetName -> {
                _state.update {
                    it.copy(name = event.name)
                }
            }
            is PreferenceEvent.SetIsAllergy -> {
                _state.update {
                    it.copy(isAllergy = event.isAllergy)
                }
            }
            PreferenceEvent.ShowDialog -> {
                _state.update {
                    it.copy(
                        isAddingPreference = true
                    )
                }
            }

        }
    }

}