package utils

import (
	"fmt"
	"strconv"

	"github.com/gin-gonic/gin"
)

func ParsePositiveInt64Param(c *gin.Context, name string) (int64, error) {
	value, err := strconv.ParseInt(c.Param(name), 10, 64)
	if err != nil {
		return 0, fmt.Errorf("must be a valid integer")
	}

	if value <= 0 {
		return 0, fmt.Errorf("must be greater than 0")
	}

	return value, nil
}
