//
//  Waiting-Signal.cpp
//  Thread
//
//  Created by 荆文征 on 2018/1/9.
//  Copyright © 2018年 s. All rights reserved.
//
#include <unistd.h>

#include <stdio.h>
#include <pthread.h>

#define MaxWaitPerople 15
#define MyNumberCard 12

int currentNumber = 0;

pthread_cond_t cond_t;
pthread_mutex_t mutex_t;

void *call(void *param){
    
    for (int i = 0; i < MaxWaitPerople; i++) {
        
        pthread_mutex_lock(&mutex_t);
        
        currentNumber++;
        
        printf("%d号 到柜台办理业务\n",currentNumber);
        
        if (currentNumber == MyNumberCard) {
        
            pthread_cond_signal(&cond_t);
        }
        
        printf("不是我，继续等待\n");
        
        pthread_mutex_unlock(&mutex_t);
        
        sleep(1);
    }
    
    pthread_exit((void *) 0);
    
    return NULL;
}

void *wait(void *param){
    
    pthread_mutex_lock(&mutex_t);
    
    while (currentNumber < MyNumberCard) {
        
        pthread_cond_wait(&cond_t, &mutex_t);
        
        printf("可算到我了 [%d]\n",MyNumberCard);
    }
    
    pthread_mutex_unlock(&mutex_t);
    
    pthread_exit((void *) 0);
    
    return NULL;
}

int main(void){
    
    pthread_cond_init(&cond_t, NULL);
    pthread_mutex_init(&mutex_t, NULL);
    
    pthread_attr_t attr;
    pthread_attr_init(&attr);
    pthread_attr_setdetachstate(&attr, PTHREAD_CREATE_JOINABLE);
    
    pthread_t callT;
    pthread_t waitT;
    
    pthread_create(&waitT, &attr, wait, NULL);
    pthread_create(&callT, &attr, call, NULL);
    
    pthread_join(waitT, NULL);
    pthread_join(callT, NULL);
    
    pthread_attr_destroy(&attr);
    pthread_cond_destroy(&cond_t);
    pthread_mutex_destroy(&mutex_t);
    pthread_exit(NULL);
}
