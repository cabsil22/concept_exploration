package com.example.tgh

import android.graphics.Paint
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material3.Button
import androidx.compose.material3.FloatingActionButton
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.RadioButton
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.layout.ModifierLocalBeyondBoundsLayout
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController

@Composable
fun PersonScreen(state: PersonState, onEvent: (PersonEvent) -> Unit, navController: NavController) {
    Scaffold(floatingActionButton = {
        FloatingActionButton(onClick = {
            onEvent(PersonEvent.ShowDialog)
        }) {
            Icon(imageVector = Icons.Default.Add, contentDescription = "Add Person" )
        }
    }) {
        padding ->
        if(state.isAddingPerson){
            AddPersonDialog(state = state, onEvent = onEvent)
        }
        LazyColumn(
            contentPadding = padding,
            modifier = Modifier.fillMaxSize(),
            verticalArrangement = Arrangement.spacedBy(16.dp)

        ) {
            item {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .horizontalScroll(rememberScrollState()),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.SpaceEvenly

                ) {
                    SortType.values().forEach { sortType ->
                        Row(
                            modifier = Modifier
                                .clickable {
                                    onEvent(PersonEvent.SortPeople(sortType))
                                },
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            RadioButton(selected = state.sortType == sortType, onClick = {
                                onEvent(PersonEvent.SortPeople(sortType))
                            })
                            Text(text = sortType.name)
                        }
                    }
                }
            }
            items(state.people){ person ->
                Row(
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(
                        modifier = Modifier.weight(1f)
                    ) {
                        TextButton(onClick = { navController.navigate("Profile/${person.id.toInt()}")})
                        {
                            Text(text = "${person.firstName} ${person.lastName}", fontSize = 20.sp)
                        }
                    }
                    IconButton(onClick = {
                        onEvent(PersonEvent.DeletePerson(person))
                    }) {
                        Icon(imageVector = Icons.Default.Delete,
                            contentDescription = "Delete Contact")
                    }
                }
            }
        }
    }
}