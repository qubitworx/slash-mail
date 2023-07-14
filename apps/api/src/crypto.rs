use magic_crypt::{new_magic_crypt, MagicCryptTrait};

pub fn encrypt(val: String) -> String {
    let secret_key = std::env::var("SECRET_KEY").unwrap();

    let mc = new_magic_crypt!(&secret_key, 256);

    let encrypted = mc.encrypt_str_to_base64(val);

    encrypted
}

pub fn decrypt(val: String) -> String {
    let secret_key = std::env::var("SECRET_KEY").unwrap();

    let mc = new_magic_crypt!(&secret_key, 256);

    let decrypted = mc.decrypt_base64_to_string(val).unwrap();

    decrypted
}
