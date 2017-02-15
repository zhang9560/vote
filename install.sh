#!/bin/bash

rm -r /Users/arch/Workspace/projects/zhangxin/social_main/app/src/main/assets/vote
find build/ -name *.map | xargs rm
cp -r build/ /Users/arch/Workspace/projects/zhangxin/social_main/app/src/main/assets/vote

