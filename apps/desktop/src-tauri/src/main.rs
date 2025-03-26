// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// Używamy env_logger do logowania
use tauri::Manager;
use log::{info, error};

fn main() {
    // Inicjalizowanie loggera
    env_logger::init();

    info!("Aplikacja Tauri uruchomiona!");

    if let Err(e) = tauri::Builder::default()
        .setup(|app| {
            info!("Konfiguracja aplikacji...");
            // Możesz dodać więcej ustawień tutaj, jeżeli trzeba
            Ok(())
        })
        .run(tauri::generate_context!()) {
            error!("Wystąpił błąd podczas uruchamiania aplikacji: {:?}", e);
            std::process::exit(1);
        }

    info!("Aplikacja Tauri działa poprawnie!");
}