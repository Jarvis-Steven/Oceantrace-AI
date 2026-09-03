use std::net::TcpStream;
use std::process::{Child, Command};
use std::sync::Mutex;
use tauri::{Manager, WindowEvent};

struct BackendChild(Mutex<Option<Child>>);

fn is_backend_running() -> bool {
    TcpStream::connect("127.0.0.1:8000").is_ok()
}

fn spawn_backend() -> Option<Child> {
    if is_backend_running() {
        println!("[Oceantrace-Desktop] Backend already active on port 8000.");
        return None;
    }

    println!("[Oceantrace-Desktop] Spawning Python FastAPI backend process...");

    let candidates = [
        ("../backend/.venv/Scripts/python.exe", "../backend"),
        ("../../backend/.venv/Scripts/python.exe", "../../backend"),
        ("backend/.venv/Scripts/python.exe", "backend"),
        ("../backend/.venv/bin/python", "../backend"),
        ("python", "../backend"),
        ("python", "backend"),
    ];

    for (py_path, work_dir) in candidates {
        let path_obj = std::path::Path::new(py_path);
        let dir_obj = std::path::Path::new(work_dir);

        if (py_path == "python" || path_obj.exists()) && dir_obj.exists() {
            println!(
                "[Oceantrace-Desktop] Attempting launch using python: '{}' in '{}'",
                py_path, work_dir
            );
            let child = Command::new(py_path)
                .args(["-m", "uvicorn", "main:app", "--host", "127.0.0.1", "--port", "8000"])
                .current_dir(work_dir)
                .spawn();

            match child {
                Ok(c) => {
                    println!("[Oceantrace-Desktop] Successfully started backend (PID {})", c.id());
                    return Some(c);
                }
                Err(e) => {
                    eprintln!("[Oceantrace-Desktop] Launch failed with '{}': {}", py_path, e);
                }
            }
        }
    }

    eprintln!("[Oceantrace-Desktop] Could not automatically spawn backend. Please verify python environment.");
    None
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let child_proc = spawn_backend();

    tauri::Builder::default()
        .manage(BackendChild(Mutex::new(child_proc)))
        .setup(|app| {
            if cfg!(debug_assertions) {
                let _ = app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                );
            }
            Ok(())
        })
        .on_window_event(|window, event| {
            if let WindowEvent::Destroyed = event {
                if let Some(state) = window.try_state::<BackendChild>() {
                    if let Ok(mut guard) = state.0.lock() {
                        if let Some(mut child) = guard.take() {
                            println!("[Oceantrace-Desktop] Terminating backend process PID {}", child.id());
                            let _ = child.kill();
                        }
                    }
                }
            }
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
