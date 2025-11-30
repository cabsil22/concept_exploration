package com.example.tgh

import android.util.Log
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.rememberScrollState
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material3.Button
import androidx.compose.material3.ElevatedButton
import androidx.compose.material3.FloatingActionButton
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.RadioButton
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavController

@Composable
fun PreferenceScreen(state: PreferenceState, onEvent: (PreferenceEvent) -> Unit, navController: NavController, personId: Int) {
    LaunchedEffect(key1 = personId) {

        onEvent(PreferenceEvent.SetPersonId(personId))
    }
    Scaffold(floatingActionButton = {
        FloatingActionButton(onClick = {
            onEvent(PreferenceEvent.ShowDialog)
        }) {
            Icon(imageVector = Icons.Default.Add, contentDescription = "Add Preference" )
        }
    }) {
            padding ->
        if(state.isAddingPreference){
            AddPreferenceDialog(state = state, onEvent = onEvent)
        }
        LazyColumn(
            contentPadding = padding,
            modifier = Modifier.fillMaxSize(),
            verticalArrangement = Arrangement.spacedBy(16.dp)

        ) {
            item {
                Row(modifier = Modifier.fillMaxWidth()){
                    TextButton(onClick = {navController.navigate("home")}) {
                        Icon(imageVector = Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Go Back")
                        Text(text="Go Back")
                    }
            }

            }

            items(state.preferences){ preference ->
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column(
                        modifier = Modifier.weight(1f)
                    ) {
                        Text(text = "${preference.name}", fontSize = 20.sp)
                        if (preference.isLiked){
                            Text("They Like this!")
                        }
                        if (preference.isAllergy) {
                            Text("They have an allergy for this!")
                        }
                    }
                    IconButton(onClick = {
                        onEvent(PreferenceEvent.DeletePreference(preference))
                    }) {
                        Icon(imageVector = Icons.Default.Delete,
                            contentDescription = "Delete Preference")
                    }
                }
            }
        }
    }
}