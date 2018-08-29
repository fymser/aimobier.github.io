//
//  Pthreads-Signal.cpp
//  Thread
//
//  Created by 荆文征 on 2018/1/11.
//  Copyright © 2018年 s. All rights reserved.
//

#include <semaphore.h> // sem
#include <fcntl.h>     // O_CREAT, S_IRUSR  S_IWUSR

#include <stdio.h>
#include <pthread.h>

const char * SEM_NAME = "/Sem_Name";

sem_t *sem;

int sum = 0;

void *thread1Method(void *arg){
    for (int i = 0; i < 10000; i++) {
        sum++;
        printf("1111111->%d\n",sum);
    }
    sem_post(sem);
    return NULL;
}

void *thread2Method(void *arg){
    sem_wait(sem);
    for (int i = 0; i < 10000; i++) {
        sum++;
        printf("222222->%d\n",sum);
    }
    return NULL;
}

int main(int argc, char const *argv[]) {

  clock_t start,finish;
  double totaltime;
  start=clock();

  sem = sem_open(SEM_NAME, O_CREAT, S_IRUSR | S_IWUSR, 0);

  pthread_t thread1,thread2;
  pthread_create(&thread1, NULL, thread1Method, NULL);
  pthread_create(&thread2, NULL, thread2Method, NULL);

  pthread_join(thread1, NULL);
  pthread_join(thread2, NULL);

  sem_close(sem);
  sem_unlink(SEM_NAME);

  finish=clock();
  totaltime=(double)(finish-start)/CLOCKS_PER_SEC;
  printf("执行时间: %f\n", totaltime);

  pthread_exit(NULL);

  return 0;
}
