pub mod cli;
pub mod config;
pub mod crypto;
pub mod functions;
pub mod mailer;
pub mod prisma;
pub mod router;

use std::sync::Arc;

use axum::{
    http::{
        header::{ACCEPT, AUTHORIZATION, CONTENT_TYPE},
        HeaderValue,
    },
    routing::get,
    Router,
};
use rspc::integrations::httpz::Request;
use tower_cookies::{CookieManagerLayer, Cookies};

use crate::{functions::mail_variables::MailVariables, router::Context};

// basic handler that responds with a static string
async fn root() -> &'static str {
    "Hello, World!"
}

#[tokio::main]
async fn main() {
    #[cfg(debug_assertions)]
    {
        std::env::set_var("RUST_LOG", "info");
    }
    dotenv::dotenv().unwrap();

    tracing_subscriber::fmt::init();

    let client = Arc::new(prisma::new_client().await.unwrap());

    cli::parse_cli(client.clone()).await;

    let config = crate::config::Config::new();

    functions::init::initialize_db(client.clone())
        .await
        .unwrap();

    let mail_variables = MailVariables::new(client.clone()).await.unwrap();

    let mut pool = mailer::pool::MailerPool::new(client.clone()).await.unwrap();
    pool.add_mailer().await.unwrap();
    pool.add_mailer().await.unwrap();
    pool.add_mailer().await.unwrap();

    pool.add_mailer().await.unwrap();
    pool.add_mailer().await.unwrap();
    pool.add_mailer().await.unwrap();

    pool.add_mailer().await.unwrap();
    pool.add_mailer().await.unwrap();
    pool.add_mailer().await.unwrap();

    pool.add_mailer().await.unwrap();

    let router = router::init_router().arced();

    let cors = tower_http::cors::CorsLayer::new()
        .allow_origin(
            std::env::var("FRONTEND_URL")
                .unwrap()
                .parse::<HeaderValue>()
                .unwrap(),
        )
        .allow_headers([AUTHORIZATION, CONTENT_TYPE, ACCEPT])
        .allow_credentials(true);

    let context = Context {
        client: client.clone(),
        config: config.clone(),
        pool: pool.clone(),
        cookies: tower_cookies::Cookies::default(),

        mail_variables: mail_variables.clone(),
    };

    let app = Router::new()
        .route("/", get(root))
        .route("/media/:path", get(functions::media::get))
        .with_state(context)

        .nest(
            "/rspc",
            router
                .endpoint(move|mut req: Request| {
                    let cookies = req
                        .deprecated_extract::<Cookies, ()>()
                        .expect("The Axum state doesn't match the router. Ensure you added `with_state(T)` where `T` matches the second generic!")
                        .unwrap();

                    router::Context {
                        client: client.clone(),
                        config: config.clone(),
                        cookies,
                        pool: pool.clone(),
                        mail_variables: mail_variables.clone(),
                    }}
                )
                .axum(),
        )
        .layer(CookieManagerLayer::new())
        .layer(cors);

    let listener = std::net::TcpListener::bind("0.0.0.0:8000").unwrap();

    log::info!("Listening on http://{}", listener.local_addr().unwrap());

    axum::Server::from_tcp(listener)
        .unwrap()
        .serve(app.into_make_service())
        .await
        .unwrap();
}
