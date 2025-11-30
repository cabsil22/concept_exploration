package com.example.tgh

sealed interface PreferenceEvent {
    object SavePreference: PreferenceEvent
    data class SetName(val name:String): PreferenceEvent
    data class SetIsLiked(val isLiked: Boolean): PreferenceEvent
    data class SetIsAllergy(val isAllergy: Boolean): PreferenceEvent
    object ShowDialog: PreferenceEvent
    object HideDialog: PreferenceEvent
    data class DeletePreference(val preference: Preference): PreferenceEvent
    data class SetPersonId(val personId: Int): PreferenceEvent


}