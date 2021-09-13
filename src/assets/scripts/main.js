let explr;

explr = (() => {
    let
        // Load all SVGs
        // Example: <svg data-url="https://domain.com/img/logo.svg"></svg>.
        // A snippet of https://blobfolio.com/2018/06/lazy-loading-sprites-inline/
        loadSVG = {
            init: () => {
                window.addEventListener('load', function () {
                    // Find our SVGs.
                    const svgs = document.querySelectorAll('svg[data-url]');
                    const svgsLen = svgs.length;
                    // Loop and process.
                    for (let i = 0; i < svgsLen; ++i) {
                        // Grab the URL and delete the attribute; we no longer
                        // need it.
                        let url = svgs[i].getAttribute('data-url');
                        svgs[i].removeAttribute('data-url');
                        // We'll let another function handle the actual fetching
                        // so we can use the async modifier.
                        loadSVG.fetchSVG(url, svgs[i]);
                    }
                });
            },
            /**
             * Fetch the SVG
             * @param {String} url URL
             * @param {Element} el Element
             * @returns {Promise<void>}
             */
            fetchSVG: async function (url, el) {
                // Dog bless fetch() and await, though be advised you'll need
                // to transpile this down to ES5 for older browsers.
                let response = await fetch(url);
                let data = await response.text();

                // This response should be an XML document we can parse.
                const parser = new DOMParser();
                const parsed = parser.parseFromString(data, 'image/svg+xml');

                // The file might not actually begin with "<svg>", and
                // for that matter there could be none, or many.
                let svg = parsed.getElementsByTagName('svg');
                if (svg.length) {
                    // But we only want the first.
                    svg = svg[0];

                    // Copy over the attributes first.
                    const attr = svg.attributes;
                    const attrLen = attr.length;
                    for (let i = 0; i < attrLen; ++i) {
                        if (attr[i].specified) {
                            // Merge classes.
                            if ('class' === attr[i].name) {
                                const classes = attr[i].value.replace(/\s+/g, ' ').trim().split(' ');
                                const classesLen = classes.length;
                                for (let j = 0; j < classesLen; ++j) {
                                    el.classList.add(classes[j]);
                                }
                            }
                            // Add/replace anything else.
                            else {
                                el.setAttribute(attr[i].name, attr[i].value);
                            }
                        }
                    }
                    // Now transfer over the children. Note: IE does not
                    // assign an innerHTML property to SVGs, so we need to
                    // go node by node.
                    while (svg.childNodes.length) {
                        el.appendChild(svg.childNodes[0]);
                    }
                }
            }
        },
        themer = () => {
            // get theme switcher button and body element
            let btn = document.querySelector('.theme-btn'),
                htmlBody = document.body;

            // attach an event handler
            btn.addEventListener('click', function (e) {
                // transition state
                htmlBody.classList.toggle('transition');

                // check button id to validate state
                if (this.dataset.state === "1") {
                    // apply theme - Light
                    htmlBody.dataset.theme = "light";
                    this.dataset.state = 0;
                } else {
                    // apply default theme - Dark
                    htmlBody.dataset.theme = "default";
                    this.dataset.state = 1;
                }

                e.preventDefault();
            });
        },
        tools = () => {

            // set and get all defaults
            let
                colorID = document.getElementById('color_val'),
                strokeID = document.getElementById('str_width'),
                outputID = document.querySelector('.output'),
                viewerID;

            // attach event to listen to element change
            [colorID, strokeID].forEach((el) => {
                el.addEventListener('change', (event) => {
                    // get all svg child nodes
                    viewerID = document.querySelector('#viewer')
                        .querySelectorAll("line, rect, path, circle, polygon, ellipse, polyline");

                    // effect change based on Stroke or Color change
                    viewerID.forEach((item) => {
                        if (event.target.id === 'color_val') {
                            // change SVG color
                            item.style.stroke = event.target.value;
                        } else {
                            // change SVG stroke width
                            item.style.strokeWidth = event.target.value;
                            // update Stroke width value in Output field
                            outputID.textContent = event.target.value;
                        }
                    });
                });
            });
        },
        processAll = () => {
            loadSVG.init();
            themer();
            tools();
        };
    return {
        init: processAll
    };
})();

export {
    explr
};