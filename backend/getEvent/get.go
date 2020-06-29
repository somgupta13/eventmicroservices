package main

import (
	"context"
	"encoding/json"
	"fmt"
	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/dynamodb"
	"github.com/aws/aws-sdk-go/service/dynamodb/dynamodbattribute"
	"github.com/aws/aws-sdk-go/service/dynamodb/expression"
	"log"
	"os"
)
type Duration struct {
	StartTime string `json:"start_time"`
	EndTime string `json:"end_time"`
}
type Request struct {
	Id          string   `json:"id"`
	UserCogId   string   `json:"cogid"`
	Title       string   `json:"title"`
	Description string   `json:"description"`
	Status      string   `json:"status"`
	Duration    Duration `json:"duration"`

}

type Responselist struct {
	Responselist []Request  `json:"response_list"`
}

var (
	db_session *dynamodb.DynamoDB

	table_name = "event_name"

	res events.APIGatewayProxyResponse

	err error

	response_list = []Request{}
	)
func init(){

	region := os.Getenv("REGION")


	sess,_ := session.NewSession(&aws.Config{

		Region:      aws.String(region),
	})

	db_session = dynamodb.New(sess)

}
func get(ctx context.Context, request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse,error){

	if request.HTTPMethod == "GET"{
		uid := request.QueryStringParameters["cogid"]
		log.Println("recieved input-id-----",uid)
		filter := expression.Name("cogid").Equal(expression.Value(uid))

		expr, err := expression.NewBuilder().WithFilter(filter).Build()

		if err != nil {
			fmt.Println("Got error building expression:")
			fmt.Println(err.Error())
		}


		params := &dynamodb.ScanInput{
			ExpressionAttributeNames:  expr.Names(),
			ExpressionAttributeValues: expr.Values(),
			FilterExpression:          expr.Filter(),
			ProjectionExpression:      expr.Projection(),
			TableName:                 aws.String(table_name),
		}


		result, err := db_session.Scan(params)
		
		log.Println("Error in scan ----" ,err)
		log.Println("result----------",result)

		for _, i := range result.Items {

			response_event := Request{}

			err = dynamodbattribute.UnmarshalMap(i, &response_event)

			response_list = append(response_list, response_event)
		}


		json_object, err := json.Marshal(&Responselist{
			Responselist: response_list,
		})

		response_list = []Request{}

		res = events.APIGatewayProxyResponse{
			Body: string(json_object),
			StatusCode: 200,
			Headers: make(map[string]string),
		}

		res.Headers["Access-Control-Allow-Origin"] = "*"
		res.Headers["Access-Control-Allow-Methods"] = "GET"
	}
	return res ,err
}
func main() {
	lambda.Start(get)
}

