use axum::Router;

use crate::server::appstate::AppState;

use tower_http::services::{ServeDir, ServeFile};

pub fn router() -> Router<AppState> {
    let serve_dir = ServeDir::new("frontend").fallback(ServeFile::new("frontend/index.html"));

    Router::new().fallback_service(serve_dir)
}
