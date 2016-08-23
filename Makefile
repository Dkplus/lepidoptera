compile: stylesheets/main.scss
	compass.ruby2.2 compile -c compass.rb stylesheets/main.scss
	cp -f stylesheets/main.css kss-template/kss-assets/.
	cp -fR stylesheets/vendors kss-template/kss-assets/.
	kss -c kss-config.json
