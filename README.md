# sprockets-stats-data-webpack-plugin

This is a webpack plugin which creates a mapping for generating a
sprockets/rails compatible asset manifest. It injects the asset mapping into
your webpack `stats` object. So you can continue choose to do as you like with
it in the stats plugin of your choice.

This plugin does **NOT** generate any sort of `stats.json` file. It only adds a
custom attribute to the `stats` object. In your stats plugin, you can call
something like `stats.toJSON().rails`, to get the relevant rails mapping.

## Setup

```
npm install sprockets-stats-webpack-plugin --save-dev
```

