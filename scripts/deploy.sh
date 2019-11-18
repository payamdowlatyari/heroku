#!/bin/bash

STATUS=$(git status);
CLEAN=$(echo "$STATUS" | grep Untracked);
if [ "$CLEAN" != "" ]
then
    printf "Untracked Files, please track, commit and push\n";
    exit 1;
fi

CLEAN=$(echo "$STATUS" | grep "not staged");
if [ "$CLEAN" != "" ]
then
    printf "Unstaged Files, please stage, commit and push\n"
    exit 1
fi

CLEAN=$(git status | grep "to be committed");
if [ "$CLEAN" != "" ]
then
    printf "Uncommited Files, please commit and push\n"
    exit 1
fi

CLEAN=$(git status | grep "Your branch is ahead");
if [ "$CLEAN" != "" ]
then
    printf "Unpushed Files, please push\n"
    exit 1
fi

CURDIR=$PWD

cd ~/Desktop
TMPDIR=$PWD/.deploy_tmp_dir
mkdir $TMPDIR
cd $TMPDIR

git clone https://github.com/4youappuci/nodejs_server
cd nodejs_server
git submodule update --init --recursive
cd src
find . -iname ".git" -exec rm -rd "{}" \;

cd ../..;

mkdir tmphero
git clone https://github.com/4youappuci/heroku.git
mv ./heroku/.git{,ignore} tmphero
mv ./nodejs_server/* tmphero
cd tmphero

git add -A; git commit -m "new version"; git push;

cd ~/Desktop
rm -rd $TMPDIR

cd $CURDIR