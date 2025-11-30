package com.example.tgh


import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.material3.Button
import androidx.compose.material3.Text
import androidx.compose.material3.TextField
import androidx.compose.material3.AlertDialog
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

@Composable
fun AddPersonDialog(
    state: PersonState,
    onEvent: (PersonEvent) -> Unit,
    modifier: Modifier = Modifier
){
    AlertDialog(
        modifier = modifier,
        onDismissRequest = { onEvent(PersonEvent.HideDialog) },
        title = { Text(text="Add Person")},
        text = {
            Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                TextField(
                    value = state.firstName,
                    onValueChange = {
                        onEvent(PersonEvent.SetFirstName(it))
                    },
                    placeholder = {Text(text = "First Name")}
                )
                TextField(
                    value = state.lastName,
                    onValueChange = {
                        onEvent(PersonEvent.SetLastName(it))
                    },
                    placeholder = {Text(text = "Last Name")}
                )
            }
        },
        confirmButton = {
            Box(modifier = Modifier.fillMaxWidth()){
                Button(onClick = {
                    onEvent(PersonEvent.SavePerson)
                }) {
                    Text(text="Save Contact")
                }
            }
        }
    )




}