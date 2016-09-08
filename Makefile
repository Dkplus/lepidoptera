compile: stylesheets/kss.scss
	compass compile -c compass.rb stylesheets/kss.scss --force
	cp -f stylesheets/*.css build/kss-template/kss-assets/.
	cp -fR stylesheets/vendors build/kss-template/kss-assets/.
	cp -fR images/* build/kss-template/kss-assets/.
	kss -c kss.json
	cp images/favicon.ico build/docs/.
