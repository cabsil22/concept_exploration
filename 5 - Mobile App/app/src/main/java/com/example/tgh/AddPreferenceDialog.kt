package com.example.tgh


import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.material3.Button
import androidx.compose.material3.Text
import androidx.compose.material3.TextField
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Checkbox
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

@Composable
fun AddPreferenceDialog(
    state: PreferenceState,
    onEvent: (PreferenceEvent) -> Unit,
    modifier: Modifier = Modifier
){
    AlertDialog(
        modifier = modifier,
        onDismissRequest = { onEvent(PreferenceEvent.HideDialog) },
        title = { Text(text="Add Preference")},
        text = {
            Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                TextField(
                    value = state.name,
                    onValueChange = {
                        onEvent(PreferenceEvent.SetName(it))
                    },
                    placeholder = {Text(text = "Preference Name")}
                )
                Row(verticalAlignment = Alignment.CenterVertically){
                    Text("Likes this:")
                    Checkbox(
                        checked = state.isLiked,
                        onCheckedChange = {
                            onEvent(PreferenceEvent.SetIsLiked(it))
                        },
                    )

                }
                Row(verticalAlignment = Alignment.CenterVertically){
                    Text("Allergic to this:")
                    Checkbox(
                        checked = state.isAllergy,
                        onCheckedChange = {
                            onEvent(PreferenceEvent.SetIsAllergy(it))
                        },
                    )

                }
            }
        },
        confirmButton = {
            Box(modifier = Modifier.fillMaxWidth()){
                Button(onClick = {
                    onEvent(PreferenceEvent.SavePreference)
                }) {
                    Text(text="Save Preference")
                }
            }
        }
    )




}