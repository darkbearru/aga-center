import {stat, unlink, copyFile, chown} from 'fs';

const fileName = '.env';
const src = './';
const dst = './.output/server';
const upload = './.output/public/upload';
let uid;
let gid;

function build(){
	const file = `${dst}/${fileName}`;
	stat(file, (err, stats) => {
		if (!err) {
			if (stats?.isFile()) {
				console.log(`${fileName} exists`);
				unlink(file, () => {
					console.log('...deleted');
					copy()
				});
			}
		} else {
			copy();
		}
	});
}

function detectUid() {
	stat(`${src}/${fileName}`, (err, stats) => {
		if (err) {
			console.log(err);
			return;
		}
		uid = stats.uid;
		gid = stats.gid;
		build();
	});
}

function copy() {
	copyFile(`${src}${fileName}`, `${dst}/${fileName}`, (err) => {
		if (err) {
			console.log(err);
			return;
		}
		console.log('...copied');
		if (uid && gid) {
			uploadRights()
		} else {
			console.log('No user info');
		}
	})
}

function uploadRights() {
	chown(upload, uid, gid, (err) => {
		if (err) {
			console.log(err);
			return;
		}
		console.log('Rights changed');
	});
}

// function cho

detectUid()
