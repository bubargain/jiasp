
#-*- coding:utf-8 -*-
from spiderFactory import *
import sys


'''
      自动启动爬虫
'''
def startSpider(start=1,end=2):
    print "let's start to spide!"
    test = simpleSpiderFactory()
    spider3 = test.createSpider('yoka')
    spider3.start(start,end)
    spider = test.createSpider('haibao')
    spider.start(start,end)
    spider2 = test.createSpider('grazia')
    spider2.start(start,end)
    
    print "Done! say thanks to Daniel..."
    

if __name__ == "__main__":
    StartOrNot = False
    start =1
    end = 2
    if len(sys.argv) == 1:
        print ''' This program is used to fetch news from several websites.\
If you don't know when and how to use it ,please query the author (if you know).\
\n[Use --help get more info]
''' 
    else:
        i = 1
        while i < len(sys.argv):
            command =''
            if sys.argv[i][:1] != '-':
                pass
            elif sys.argv[i] == '-':
                try:
                    i+=1
                    command = sys.argv[i]
                except:
                    print "Input format error"
            else:
                command = sys.argv[i][1:]
               
            if command == '-help':
                print "use \n-a to set start automatically\n-s to set start list page \n-e to set end list page"
                break
            
            elif command == 'a':
                StartOrNot = True
                break
            
            elif command == 's':
                try:
                    StartOrNot = True
                    i = i+1
                    start = int(sys.argv[i])
                except:
                    print "Input format error"
                    raise
            elif command == 'e':
                try:
                    StartOrNot = True
                    i =i+1
                    end = int(sys.argv[i])
                except:
                    print "Input format error"
                    raise
            else :
                print "Input format error or command not found"
                break
            
            i+=1
        
        if StartOrNot :
            if start > end:
                print "ERROR :you can't set start position larger than end \n[start =",start," , end =",end,"]"
            else:
                print 'Starting Now...\nSpider start at page',start,',will end at page' ,end
                startSpider(start,end)
                    
