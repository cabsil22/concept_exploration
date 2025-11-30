package com.example.tgh

import android.os.Bundle
import android.util.Log
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.activity.viewModels
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import androidx.room.Room
import com.example.tgh.ui.theme.TghTheme

class MainActivity : ComponentActivity() {



    private val db by lazy {
        Room.databaseBuilder(
            applicationContext,
            PersonDatabase::class.java,
            name = "people.db"
        )
            .fallbackToDestructiveMigration(true)
            .build()
    }

    private val viewModel by viewModels<PersonViewModel>(
        factoryProducer = {
            object : ViewModelProvider.Factory {
                override fun <T : ViewModel> create(modelClass: Class<T>): T {
                    return PersonViewModel(db.dao) as T
                }
            }
        }
    )

    private val preferenceViewModel by viewModels<PreferenceViewModel>(
        factoryProducer = {
            object : ViewModelProvider.Factory {
                override fun <T : ViewModel> create(modelClass: Class<T>): T {
                    return PreferenceViewModel(db.dao) as T
                }
            }
        }
    )

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            TghTheme {
                val navController = rememberNavController()
                val state by viewModel.state.collectAsState()
                val preferenceState by preferenceViewModel.state.collectAsState()
                NavHost(navController = navController, startDestination = "home") {
                    composable("profile/{uId}") { navBackStackEntry ->
                        val uId = navBackStackEntry.arguments?.getString("uId") ?: "1"
                        val intUID = uId.toInt()
                        PreferenceScreen(state = preferenceState, onEvent = preferenceViewModel::onEvent, navController = navController, personId = intUID)}
                    composable("home") { PersonScreen(state= state, onEvent = viewModel::onEvent, navController = navController)}

                }

            }
        }
    }
}
