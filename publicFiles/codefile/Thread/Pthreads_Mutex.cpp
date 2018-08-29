//
//  Mutex.cpp
//  Thread
//
//  Created by 荆文征 on 2018/1/9.
//  Copyright © 2018年 s. All rights reserved.
//

#include <unistd.h>
#include <stdio.h>
#include <pthread.h>

/// Thread Count Number
#define TN 6
int count = 0;
pthread_mutex_t mutex_t;

void * barriers(void * param){

//    pthread_mutex_lock(&mutex_t);

    for (long i = 0; i < TN; i++) {
        count++;
        printf("线程[%ld]: 计数器 - <%d> \n",((long)param),count);
        sleep(1);
    }

//    pthread_mutex_unlock(&mutex_t);
    pthread_exit(NULL);
    return NULL;
}

int main(void){

    pthread_mutex_init(&mutex_t, NULL);

    pthread_t threads[TN];

    for (long i = 0; i < TN; i++) {

        pthread_create(&threads[i], NULL, barriers, (void * )i);
//        pthread_join(threads[i], NULL);
    }

    pthread_mutex_destroy(&mutex_t);
    pthread_exit(NULL);
}
