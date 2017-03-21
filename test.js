var parser = require("./parser"),
    source = parser('<section class="block_news">\
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
</section>');

console.log(source);
