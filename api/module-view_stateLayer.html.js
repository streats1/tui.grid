tui.util.defineNamespace("fedoc.content", {});
fedoc.content["module-view_stateLayer.html"] = "<div id=\"main\" class=\"main\">\n\n\n\n\n<section>\n\n<header>\n    \n        \n            \n                <h2>view/stateLayer</h2>\n            \n        \n            \n        \n    \n</header>\n\n<article>\n    \n    <div class=\"container-overview\">\n    \n        \n            <div class=\"description\"><p>Layer class that represents the state of rendering phase.</p></div>\n        \n\n        \n            \n<div class=\"\">\n<dt>\n    \n</dt>\n<dd>\n\n    \n\n    \n\n    \n\n    \n\n    \n\n    \n\n    \n\n\n<dl class=\"details\">\n\n    \n\n    \n\n    <!--\n    \n    -->\n\n    \n\n    \n\n    \n\n    \n\n    \n\n    \n\n    \n\n    \n\n    \n\n    \n\n    \n\n    \n</dl>\n\n\n\n    \n\n    \n\n    \n\n    \n\n    \n\n    \n</dd>\n</div>\n\n        \n            \n<div class=\"\">\n<dt>\n    \n        <h4 class=\"name\" id=\"module:view/stateLayer\">\n            <span class=\"type-signature\"></span>new (require(\"view/stateLayer\"))<span class=\"signature\">(options)</span><span class=\"type-signature\"></span>\n            \n                <div class=\"container-source method\">\n                    <code>file</code>,\n                    <code>line 24</code>\n                </div>\n            \n        </h4>\n\n        \n    \n</dt>\n<dd>\n\n    \n\n    \n\n    \n\n    \n\n    \n    <div class=\"container-params\">\n        <div class=\"params\">\n\n<table class=\"params\">\n    <thead>\n    <tr>\n        \n        <th>Name</th>\n        \n\n        <th>Type</th>\n\n        \n\n        \n\n        <th class=\"last\">Description</th>\n    </tr>\n    </thead>\n\n    <tbody>\n    \n\n        <tr>\n            \n                <td class=\"name first\"><code>options</code></td>\n            \n\n            <td class=\"type\">\n            \n                \n<span class=\"param-type\">Object</span>\n\n\n            \n            </td>\n\n            \n\n            \n\n            <td class=\"description last\"><p>Options</p></td>\n        </tr>\n\n    \n    </tbody>\n</table></div>\n    </div>\n    \n\n    \n\n    \n\n\n<dl class=\"details\">\n\n    \n\n    \n\n    <!--\n    \n    -->\n\n    \n\n    \n\n    \n\n    \n\n    \n\n    \n\n    \n\n    \n\n    \n\n    \n\n    \n\n    \n</dl>\n\n\n\n    \n\n    \n\n    \n\n    \n\n    \n\n    \n</dd>\n</div>\n\n        \n    \n    </div>\n    \n\n    \n        <h3 class=\"subsection-title\">Extends</h3>\n        \n<dl>\n    <dt><h4 class=\"name\">\n        module:base/view\n        <div class=\"container-source members\">\n            <code><a href=\"module-base_view.html\">module:base/view</a></code>\n        </div>\n    <h4></dt>\n</dl>\n\n    \n\n    \n\n    \n\n     \n\n    \n\n    \n\n    \n    <div class=\"container-methods\">\n        <h3 class=\"subsection-title\">Methods</h3>\n\n        <dl>\n            \n<div class=\"tui-hidden\">\n<dt>\n    \n        <h4 class=\"name\" id=\"_getMessage\">\n            <span class=\"type-signature\"></span>_getMessage<span class=\"signature\">(renderState)</span><span class=\"type-signature\"> &rarr; {string}</span>\n            \n                <div class=\"container-source method\">\n                    <code>file</code>,\n                    <code>line 82</code>\n                </div>\n            \n        </h4>\n\n        \n    \n</dt>\n<dd>\n\n    \n    <div class=\"description\">\n        <p>Returns the message based on the renderState value</p>\n    </div>\n    \n\n    \n\n    \n\n    \n\n    \n    <div class=\"container-params\">\n        <div class=\"params\">\n\n<table class=\"params\">\n    <thead>\n    <tr>\n        \n        <th>Name</th>\n        \n\n        <th>Type</th>\n\n        \n\n        \n\n        <th class=\"last\">Description</th>\n    </tr>\n    </thead>\n\n    <tbody>\n    \n\n        <tr>\n            \n                <td class=\"name first\"><code>renderState</code></td>\n            \n\n            <td class=\"type\">\n            \n                \n<span class=\"param-type\">string</span>\n\n\n            \n            </td>\n\n            \n\n            \n\n            <td class=\"description last\"><p>Renderer.state value</p></td>\n        </tr>\n\n    \n    </tbody>\n</table></div>\n    </div>\n    \n\n    \n    <div class=\"container-returns\">\n        <div class=\"returns\">\n        <h5>Returns:</h5>\n        <div class=\"details\">\n        \n                \n<div class=\"param-desc\">\n    <ul>\n<li>Message</li>\n</ul>\n</div>\n\n            \n        </div>\n        </div>\n    </div>\n    \n\n    \n\n\n<dl class=\"details\">\n\n    \n\n    \n\n    <!--\n    \n    -->\n\n    \n\n    \n\n    \n\n    \n\n    \n\n    \n\n    \n\n    \n\n    \n\n    \n\n    \n\n    \n</dl>\n\n\n\n    \n\n    \n\n    \n\n    \n\n    \n\n    \n</dd>\n</div>\n\n        \n            \n<div class=\"tui-hidden\">\n<dt>\n    \n        <h4 class=\"name\" id=\"render\">\n            <span class=\"type-signature\"></span>render<span class=\"signature\">()</span><span class=\"type-signature\"> &rarr; {object}</span>\n            \n                <div class=\"container-source method\">\n                    <code>file</code>,\n                    <code>line 48</code>\n                </div>\n            \n        </h4>\n\n        \n    \n</dt>\n<dd>\n\n    \n    <div class=\"description\">\n        <p>Render</p>\n    </div>\n    \n\n    \n\n    \n\n    \n\n    \n\n    \n    <div class=\"container-returns\">\n        <div class=\"returns\">\n        <h5>Returns:</h5>\n        <div class=\"details\">\n        \n                \n<div class=\"param-desc\">\n    <p>This object</p>\n</div>\n\n            \n        </div>\n        </div>\n    </div>\n    \n\n    \n\n\n<dl class=\"details\">\n\n    \n\n    \n\n    <!--\n    \n    -->\n\n    \n\n    \n\n    \n\n    \n\n    \n\n    \n\n    \n\n    \n\n    \n\n    \n\n    \n\n    \n</dl>\n\n\n\n    \n\n    \n\n    \n\n    \n\n    \n\n    \n</dd>\n</div>\n\n        </dl>\n    </div>\n    \n\n    \n\n    \n</article>\n\n</section>\n\n\n\n</div>"