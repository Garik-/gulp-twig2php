var Twig = require('twig');
var template = Twig.twig({
    data: '<section class="block_news">\
      <h3>{{ name }}</h3>\
      <div class="block">\
      {% for row in rows %}\
        <a href="{{ constant(\'BASE_PATH_HREF\') ~ row.link }}" class="item">\
        {% if row.img %}\
          {% set img = row.img[0] %}\
          <span class="img">\
            <img src="{{ img.src }}" alt="{{ img.alt }}">\
          </span>\
        {% endif %}\
          <span class="info">\
            <span class="title">{{ row.name }}</span>\
            <span class="date">{{ row.date }}</span>\
          </span>\
        </a>\
     {% endfor %}\
     </div>\
    </section>'
});

function createToken(input, type, value) {
    input.push({
        type: type,
        value: value
    });
}

function parseToken(token) {

    var output = [],
        type = 'raw';

    switch (token.type) {

        case 'Twig.expression.type.number':

            createToken(output, type, token.value);
            break;
        case 'Twig.expression.type.key.brackets':
            createToken(output, type, '[');

            for (var i = 0; i < token.stack.length; i++) {
                output.push(parseToken(token.stack[i]));
            }

            createToken(output, type, ']');
            break;
        case 'Twig.logic.type.set':

            createToken(output, 'set', '$' + token.key + ' = ');
            for (var i = 0; i < token.expression.length; i++) {
                output.push(parseToken(token.expression[i]));
            }

            createToken(output, type, ";\n");
            break;

        case 'Twig.expression.type.string':
            createToken(output, 'string', "'" + token.value + "'");

            break;
        case 'Twig.expression.type.parameter.start':
        case 'Twig.expression.type.parameter.end':
            createToken(output, type, token.value);
            break;
        case 'Twig.expression.type._function':

            createToken(output, '_function', token.fn);

            for (var i = 0; i < token.params.length; i++) {
                output.push(parseToken(token.params[i]));
            }

            break;
        case 'Twig.expression.type.key.period':

            createToken(output, 'period', "['" + token.key + "']");
            break;

        case 'Twig.logic.type.if':

            createToken(output, 'if', "if(");

            for (var i = 0; i < token.stack.length; i++) {
                output.push(parseToken(token.stack[i]));
            }
            createToken(output, 'obrace', ") {");

            for (var i = 0; i < token.output.length; i++) {
                output.push(parseToken(token.output[i]));
            }
            createToken(output, 'ebrace', "}");
            break;
        case 'Twig.logic.type.for':

            var as = ' as ';
            if (token.key_var && token.value_var) {
                as += '$' + token.key_var + ' => ';
            }
            as += '$' + token.value_var;

            createToken(output, 'foreach', 'foreach (');
            for (var i = 0; i < token.expression.length; i++) {
                output.push(parseToken(token.expression[i]));
            }

            createToken(output, 'obrace', as + ') {');

            for (var i = 0; i < token.output.length; i++) {
                output.push(parseToken(token.output[i]));
            }

            createToken(output, 'ebrace', "}");
            break;
        case 'raw':
            var s = token.value.toString().trim().replace(/\'/g, '\\\'');
            s = s.replace(/[\s\uFEFF\xA0]{2,}/g, '');

            if (s.length > 0) {
                createToken(output, 'echo', "'" + s + "'");
            }
            break;
        case 'Twig.expression.type.variable':
            createToken(output, 'var', '$' + token.value);
            break;
        case 'logic':
            output.push(parseToken(token.token));
            break;
        case 'output':

            for (var i = 0; i < token.stack.length; i++) {
                output.push(parseToken(token.stack[i]));
            }
            break;
        default:
            //console.log(token);
    }


    return output;
}

var code = [];
for (var i = 0; i < template.tokens.length; i++) {
    code.push(parseToken(template.tokens[i]));
}

var flags = {
    echo: false,
    tabs: 0
};

function toSource(items) {

    var source_code = '';


    for (var i = 0; i < items.length; i++) {
        var item = items[i];

        if (Array.isArray(item)) {

            source_code += toSource(item);
            continue;
        }

        switch (item.type) {
            case 'ebrace':
                --flags.tabs;
            case 'set':
                source_code += "\t".repeat(flags.tabs);
            case 'foreach':
            case 'if':
                if (flags.echo) {
                    flags.echo = false;
                    source_code += ";\n" + "\t".repeat(flags.tabs);
                }
                break;
            case '_function':
                if (flags.echo) {
                    source_code += ' . ';
                }
                break;
            case 'var':
                if (flags.echo) {
                    source_code += ' . ';
                }
                break;
            case 'echo':
                if (!flags.echo) {
                    flags.echo = true;
                    source_code += "\t".repeat(flags.tabs) + 'echo ';
                } else {
                    source_code += ' . ';
                }
                break;
            default:
                //console.log(item, flags);
        }

        source_code += item.value;

        switch (item.type) {
            case 'obrace':
                flags.tabs++;
            case 'ebrace':
                source_code += "\n";
                break;
        }



    };

    return source_code;
}

var source = "<?php \n\n" + toSource(code);
if (flags.echo) {
    source += ';'
}

console.log(source);
