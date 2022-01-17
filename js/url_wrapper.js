/*!
 *  @brief  urlWrapper
 *  @note   urlを扱いやすくしたもの
 */
class urlWrapper {

    constructor(url) {
        var href_div = (function() {
            const href_header = [
                'http://',
                'https://'
            ];
            for (const headar of href_header) {
                if (url.substr(0, headar.length) == headar) {
                    return url.substr(headar.length).split('/');
                }
            }
            return [];
        })();
        this.url = url;
        if (href_div.length > 0) {
            this.domain = href_div[0];
        } else {
            this.domain = '';
        }
        this.subdir = [];
        if (href_div.length > 1) {
            for (var i = 1; i < href_div.length; i++) {
                if (href_div[i] != '') {
                    this.subdir.push(href_div[i]);
                }
            }
        }
    }

    get_url_without_protocol() {
        var ret = this.domain;
        this.subdir.forEach(elem => {
            ret += '/' + elem;
        });
        return ret;
    }

    in_livedoor()
    {
        return this.domain.indexOf("blog.livedoor.com") >= 0;
    }
    in_blogmura()
    {
        return this.domain.indexOf("blogmura.com") >= 0;
    }
    in_with2()
    {
        return this.domain.indexOf("blog.with2.net") >= 0;
    }
}
