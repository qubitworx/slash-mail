use std::sync::Arc;

use crate::prisma::PrismaClient;

pub async fn parse_cli(client: Arc<PrismaClient>) {
    let arguments = std::env::args().collect::<Vec<String>>();

    // check if populate is in the arguments
    if arguments.contains(&"populate".to_string()) {
        for i in 0..1000000 {
            client
                .subscriber()
                .create(
                    format!("Subscriber_{}@example.com", i),
                    format!("Subscriber_{}", i),
                    "enabled".to_string(),
                    "".to_string(),
                    vec![],
                )
                .exec()
                .await;
        }

        std::process::exit(0);
    }
}
