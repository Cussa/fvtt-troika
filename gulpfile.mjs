import gulp from "gulp";
import {deleteAsync, deleteSync} from "del";
import fs from "fs-extra";
import path from "path";
import {exec, execSync} from 'child_process';

function cleanPacks(){
    console.log('deleting compendium packs...');
    deleteSync(['./packs/troika-srd-items/*']);
    deleteSync(['./packs/troika-srd-roll-tables/*']);
    deleteSync(['./packs/troika-srd-skills/*']);
    deleteSync(['./packs/troika-srd-spells/*']);
    deleteSync(['./packs/troika-srd-weapons-and-attacks/*']);
    console.log('existing packs deleted.');
}

function buildPacks(){
  exec('fvtt package pack "troika-srd-items" --inputDirectory "./source/packs/troika-srd-items" --outputDirectory "./packs"', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    //cb(err);
    if(err != null){
      console.log(err);
    }    
  });

  exec('fvtt package pack "troika-srd-roll-tables" --inputDirectory "./source/packs/troika-srd-roll-tables" --outputDirectory "./packs"', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    //cb(err);
    if(err != null){
      console.log(err);
    } 
  });

  exec('fvtt package pack "troika-srd-skills" --inputDirectory "./source/packs/troika-srd-skills" --outputDirectory "./packs"', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    //cb(err);
    if(err != null){
      console.log(err);
    } 
  });

  exec('fvtt package pack "troika-srd-spells" --inputDirectory "./source/packs/troika-srd-spells" --outputDirectory "./packs"', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    //cb(err);
    if(err != null){
      console.log(err);
    } 
  });

  exec('fvtt package pack "troika-srd-weapons-and-attacks" --inputDirectory "./source/packs/troika-srd-weapons-and-attacks" --outputDirectory "./packs"', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    //cb(err);
    if(err != null){
      console.log(err);
    } 
  });

  exec('fvtt package pack "troika-srd-backgrounds" --inputDirectory "./source/packs/troika-srd-backgrounds" --outputDirectory "./packs"', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    //cb(err);
    if(err != null){
      console.log(err);
    } 
  });
}

const build = () =>
  new Promise(done => {
    console.log('Beginning build process...');
    cleanPacks();
    console.log('Building compendium packs...');
    buildPacks();
    console.log('Build process complete.');
    done();    
});

gulp.task('build-packs', function (cb) {
  buildPacks();
});

function getTroikaSystemPath(){
  let foundrydataPath = "";
  foundrydataPath = execSync('fvtt configure get dataPath').toString().trim();
  foundrydataPath += '/Data/systems/troika';  
  return foundrydataPath;
}

// THIS WILL DELETE THE EXISTING TROIKA SYSTEM!
// MAKE SURE THIS CODE ISN'T RUNNING *FROM* THE FOUNDRY DATA PATH!
function cleanExistingTroikaSystemFiles(){
  let troikaPath = getTroikaSystemPath();

  if(troikaPath !== null && troikaPath !== '' && troikaPath.indexOf("/Data/systems/troika") > 1){
    console.log('Deleting all files in: ' + troikaPath);
    deleteSync([troikaPath + '/*'], {force: true});
  }
  else{
    console.log('ERROR - BAD TROIKA PATH, WILL NOT CLEAN FOLDER! CHECK THAT FOUNDRY CLI CONFIGURED PROPERLY!');
  }

}

gulp.task('clean-existing-system-files', function (done) {
  cleanExistingTroikaSystemFiles()
  done();
});

gulp.task('test', function (done) {

  let troikaPath = getTroikaSystemPath();

  gulp.src(['./**/*']).pipe(gulp.dest(troikaPath));

  done();
});

export default build;