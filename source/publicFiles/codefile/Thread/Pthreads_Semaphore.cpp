//
//  Pthreads-Signal.cpp
//  Thread
//
//  Created by 荆文征 on 2018/1/11.
//  Copyright © 2018年 s. All rights reserved.
//

#include <stdio.h>
#include <pthread.h>

int sum = 0;
pthread_mutex_t mutex;

void *thread1Method(void *arg){
    for (int i = 0; i < 1000; i++) {
        pthread_mutex_lock(&mutex);
        sum++;
        printf("1111111->%d\n",sum);
        pthread_mutex_unlock(&mutex);
    }

    return NULL;
}

void *thread2Method(void *arg){
    for (int i = 0; i < 1000; i++) {
        pthread_mutex_lock(&mutex);
        sum++;
        printf("222222->%d\n",sum);
        pthread_mutex_unlock(&mutex);
    }
    return NULL;
}

int main(int argc, char const *argv[]) {

  pthread_mutex_init(&mutex, NULL);

  pthread_t thread1,thread2;
  pthread_create(&thread1, NULL, thread1Method, NULL);
  pthread_create(&thread2, NULL, thread2Method, NULL);

  pthread_mutex_destroy(&mutex);
  pthread_exit(NULL);

  return 0;
}
