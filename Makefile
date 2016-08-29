compile: stylesheets/default.scss
	compass compile -c compass.rb stylesheets/default.scss --force
	cp -f stylesheets/*.css build/kss-template/kss-assets/.
	cp -fR stylesheets/vendors build/kss-template/kss-assets/.
	cp -fR images/* build/kss-template/kss-assets/.
	kss -c kss.json
