import ssl


def get_custom_tls_config(ca_file):
    tls_config = ssl.create_default_context(ssl.Purpose.CLIENT_AUTH)

    try:
        import io
        with io.open(ca_file) as f:
            ca_certs = f.read()
    except IOError as e:
        return None, e

    try:
        tls_config.load_verify_locations(cadata=ca_certs)
    except ssl.SSLError as e:
        return tls_config, e

    return tls_config, None
