package types

type TescoMetadata struct {
	Category       string `json:"category"` // "alcohol", "food", etc.
	TescoExclusive bool   `json:"tescoExclusive"`
	IsClubcard     bool   `json:"isClubcard"`
	ShowPrice      bool   `json:"showPrice"`
	EndDate        string `json:"endDate"`      // DD/MM
	CreativeSize   string `json:"creativeSize"` // "story", "post", "fb"
	IsPinterest    bool   `json:"isPinterest"`
}
