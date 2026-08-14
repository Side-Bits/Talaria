package utils

import (
	"fmt"
	"strconv"

	"github.com/gin-gonic/gin"
)

func ParsePositiveInt64Param(c *gin.Context, name string) (int64, error) {
	param := c.Param(name)
	value, err := strconv.ParseInt(param, 10, 64)
	if err != nil {
		return 0, fmt.Errorf("invalid param %q: %w", param, err)
	}

	if value <= 0 {
		return 0, fmt.Errorf("must be greater than 0")
	}

	return value, nil
}
