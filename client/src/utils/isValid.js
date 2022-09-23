import validator from "validator";

export const isValid = (s) => {
    let options = {
        protocols: ["http", "https", "ftp"],
        require_tld: true,
        require_protocol: false,
        require_host: true,
        require_valid_protocol: true,
        allow_underscores: false,
        host_whitelist: false,
        host_blacklist: false,
        allow_trailing_dot: false,
        allow_protocol_relative_urls: false,
        disallow_auth: false,
    };

    // let options = {
    //     host_blacklist: ['foo.com', 'bar.com'],
    // }

    return s ? validator.isURL(s, options) : false
}