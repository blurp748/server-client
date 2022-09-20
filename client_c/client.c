#include <arpa/inet.h>
#include <stdio.h>
#include <string.h>
#include <sys/socket.h>
#include <unistd.h>
#define PORT 83
 
int main(int argc, char const* argv[])
{
    int sock = 0, valread, client_fd;
    struct sockaddr_in serv_addr;

    if ((sock = socket(AF_INET, SOCK_STREAM, 0)) < 0) {
        printf("\n Socket creation error \n");
        return -1;
    }
 
    serv_addr.sin_family = AF_INET;
    serv_addr.sin_port = htons(PORT);
 
    if (inet_pton(AF_INET, "176.170.180.177", &serv_addr.sin_addr)
        <= 0) {
        printf(
            "\nInvalid address/ Address not supported \n");
        return -1;
    }
 
    if ((client_fd
         = connect(sock, (struct sockaddr*)&serv_addr,
                   sizeof(serv_addr)))
        < 0) {
        printf("\nConnection Failed \n");
        return -1;
    }

    int canContinue = 1;
    while(canContinue){
        char buffer[1024] = { 0 };
        char* calcul;
        printf("Calcul :"); 
        scanf("%s",calcul);

        send(sock, calcul, strlen(calcul), 0);

        printf("%s sent\n", calcul);
        valread = read(sock, buffer, 1024);
        printf("%s\n", buffer);
    }
 
    // closing the connected socket
    close(client_fd);
    return 0;
}